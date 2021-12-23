// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/Math.sol";
import "./interfaces/ISherpaInstance.sol";
import "./interfaces/ISherpaTrees.sol";

contract SherpaProxy {
  using SafeERC20 for IERC20;

  event EncryptedNote(address indexed sender, bytes encryptedNote);
  event InstanceStateUpdated(ISherpaInstance indexed instance, InstanceState state);
  event SherpaTreesUpdated(ISherpaTrees addr);

  enum InstanceState { DISABLED, ENABLED, MINEABLE }

  struct Instance {
    bool isERC20;
    IERC20 token;
    InstanceState state;
  }

  struct Sherpa {
    ISherpaInstance addr;
    Instance instance;
  }

  ISherpaTrees public sherpaTrees;
  address public governance;
  mapping(ISherpaInstance => Instance) public instances;

  modifier onlyGovernance() {
    require(msg.sender == governance, "Not authorized");
    _;
  }

  constructor(
    address _sherpaTrees,
    address _governance,
    Sherpa[] memory _instances
  ) public {
    sherpaTrees = ISherpaTrees(_sherpaTrees);
    governance = _governance;

    for (uint256 i = 0; i < _instances.length; i++) {
      _updateInstance(_instances[i]);
    }
  }

  function deposit(
    ISherpaInstance _sherpa,
    bytes32 _commitment,
    bytes calldata _encryptedNote
  ) external payable {
    Instance memory instance = instances[_sherpa];
    require(instance.state != InstanceState.DISABLED, "The instance is not supported");

    if (instance.isERC20) {
      instance.token.safeTransferFrom(msg.sender, address(this), _sherpa.denomination());
    }
    _sherpa.deposit{ value: msg.value }(_commitment);

    if (instance.state == InstanceState.MINEABLE) {
      sherpaTrees.registerDeposit(address(_sherpa), _commitment);
    }
    emit EncryptedNote(msg.sender, _encryptedNote);
  }

  function withdraw(
    ISherpaInstance _sherpa,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _recipient,
    address payable _relayer,
    uint256 _fee,
    uint256 _refund
  ) external payable {
    Instance memory instance = instances[_sherpa];
    require(instance.state != InstanceState.DISABLED, "The instance is not supported");

    _sherpa.withdraw{ value: msg.value }(_proof, _root, _nullifierHash, _recipient, _relayer, _fee, _refund);
    if (instance.state == InstanceState.MINEABLE) {
      sherpaTrees.registerWithdrawal(address(_sherpa), _nullifierHash);
    }
  }

  function backupNotes(bytes[] calldata _encryptedNotes) external {
    for (uint256 i = 0; i < _encryptedNotes.length; i++) {
      emit EncryptedNote(msg.sender, _encryptedNotes[i]);
    }
  }

  function updateInstance(Sherpa calldata _sherpa) external onlyGovernance {
    _updateInstance(_sherpa);
  }

  function setSherpaTreesContract(ISherpaTrees _sherpaTrees) external onlyGovernance {
    sherpaTrees = _sherpaTrees;
    emit SherpaTreesUpdated(_sherpaTrees);
  }

  function setGovernance(address _governance) external onlyGovernance {
    governance = _governance;
  }

  /// @dev Method to claim junk and accidentally sent tokens
  function rescueTokens(
    IERC20 _token,
    address payable _to,
    uint256 _amount
  ) external onlyGovernance {
    require(_to != address(0), "SHERPA: can not send to zero address");

    if (_token == IERC20(0)) {
      // for Ether
      uint256 totalBalance = address(this).balance;
      uint256 balance = Math.min(totalBalance, _amount);
      _to.transfer(balance);
    } else {
      // any other erc20
      uint256 totalBalance = _token.balanceOf(address(this));
      uint256 balance = Math.min(totalBalance, _amount);
      require(balance > 0, "SHERPA: trying to send 0 balance");
      _token.safeTransfer(_to, balance);
    }
  }

  function _updateInstance(Sherpa memory _sherpa) internal {
    instances[_sherpa.addr] = _sherpa.instance;
    if (_sherpa.instance.isERC20) {
      IERC20 token = IERC20(_sherpa.addr.token());
      require(token == _sherpa.instance.token, "Incorrect token");
      uint256 allowance = token.allowance(address(this), address(_sherpa.addr));

      if (_sherpa.instance.state != InstanceState.DISABLED && allowance == 0) {
        token.safeApprove(address(_sherpa.addr), uint256(-1));
      } else if (_sherpa.instance.state == InstanceState.DISABLED && allowance != 0) {
        token.safeApprove(address(_sherpa.addr), 0);
      }
    }
    emit InstanceStateUpdated(_sherpa.addr, _sherpa.instance.state);
  }
}
