import axios from 'axios';
const API_URL = '192.168.100.34'
const state = {
  token: localStorage.getItem('interset-token') || "",
  status: "",
}

const getter = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      axios({
        method: 'POST',
        url: `${API_URL}/api/actions/login`,
        data: user
      })
    })
  }
}