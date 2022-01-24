import { erc20ABI } from "assets/abi";

export const state = () => {
  return {
    relayersList: [
      {
        id: 1,
        url: "https://relayer.sherpa.entropygra.ph",
        name: 'Sherpa Relayer',
        chainId: 43114,
        fee: 1,
        status: {}
      },
      {
        id: 2,
        url: "https://relayer-fuji.sherpa.entropygra.ph",
        name: 'Sherpa Fuji Relayer',
        chainId: 43113,
        fee: 1,
        status: {}
      },
      {
        id: 3,
        url: "http://localhost:8000",
        name: 'Local Test Relayer',
        chainId: 43114,
        fee: 0.10,
        status: {}
      },
      {
        id: 4,
        url: "http://localhost:8000",
        name: 'Local Test Relayer',
        chainId: 43113,
        fee: 0.10,
        status: {}
      }
    ],
    selectedRelayerId: 1
  }
}

export const getters = {
  getSelectedRelayer: state => {
    return state.relayersList.find(relayer => relayer.id === state.selectedRelayerId);
  },
  getRelayersList: state => {
    return state.relayersList.filter(relayer => relayer.chainId === $nuxt.$config.chainId);
  },
}

export const mutations = {
  setSelectedRelayerId(state, id) {
    state.selectedRelayerId = id;
  },
  setStatus(state, { relayerId, status }){
    state.relayersList.find(relayer => relayer.id === relayerId).status = status;
  }
}

export const actions = {
  async fetchRelayerStatus({ dispatch, state, commit, getters, rootState }, relayerId){

    const relayer = getters.getSelectedRelayer

    const status = await this.$axios.$get(
      `${relayer.url}/v1/status`
    );

    console.log('status response', status)

    commit('setStatus', { relayerId, status })
  },
}
