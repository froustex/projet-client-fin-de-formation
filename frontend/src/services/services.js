import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

/*
 ** Use for Toastify component
 */

const notifySuccess = (message) => {
  toast.success(`Bravo : ${message}`);
};

const notifyError = (message) => {
  toast.error(`Erreur : ${message}`);
};

/*
 ** Use For logIn and logOff
 */

const authentification = (user, setIsLog, setInfoUser) => {
  const ENDPOINT = "/auth";
  api
    .post(ENDPOINT, user, { withCredentials: true })
    .then((response) => {
      setInfoUser({
        role: response.data.role,
        email: response.data.email,
        etat: response.data.etat,
      });
      sessionStorage.setItem(`role`, response.data.role);
      sessionStorage.setItem(`email`, response.data.email);
      sessionStorage.setItem(`etat`, response.data.etat);
      setIsLog(true);
      notifySuccess("La connection a réussi");
    })
    .catch(() => {
      notifyError(
        "Un problème est survenu lors de votre tentative de connection"
      );
    });
};

const Deconnexion = (navigate, setInfoUser) => {
  const ENDPOINTDECONNEXION = "/deconnexion";
  api.post(ENDPOINTDECONNEXION).then((status) => {
    if (status.status === 200) {
      setInfoUser({});
      sessionStorage.removeItem(`role`);
      sessionStorage.removeItem(`email`);
      sessionStorage.removeItem(`etat`);
      localStorage.removeItem(`role`);
      localStorage.removeItem(`email`);
      localStorage.removeItem(`etat`);
      navigate("/");
      notifySuccess("Déconnexion réussie !");
    }
  });
};

const swap = (arr, i, j) => {
  const tmp = arr[i];
  // eslint-disable-next-line no-param-reassign
  arr[i] = arr[j];
  // eslint-disable-next-line no-param-reassign
  arr[j] = tmp;
};

const sortByDate = (array) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++)
      if (new Date(array[i].date_debut) < new Date(array[j].date_debut)) {
        swap(array, i, j);
      }
  }
  return array;
};

export {
  authentification,
  Deconnexion,
  notifySuccess,
  notifyError,
  api,
  sortByDate,
};
