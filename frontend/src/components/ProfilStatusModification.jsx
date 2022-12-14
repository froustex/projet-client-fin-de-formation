import React, { useEffect, useState } from "react";
import { notifySuccess, notifyError, api } from "@services/services";

function ProfilStatusModification({ user }) {
  const [etat, setEtat] = useState("undefined");
  const [update, setUpdate] = useState(false);
  let ENDPOINTETAT = "";
  let ENDPOINT = "";

  if (user.prenom !== undefined) {
    ENDPOINTETAT = `/intervenants/etat/${user.id}`;
    ENDPOINT = `/intervenants/bymail/${user.email}`;
  } else {
    ENDPOINTETAT = `/associations/etat/${user.id}`;
    ENDPOINT = `/associations/bymail/${user.email}`;
  }

  useEffect(() => {
    api
      .get(ENDPOINT)
      .then((res) => {
        setEtat(res.data[0].etat);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user, update]);

  const handleStatus = (newStatus) => {
    api
      .put(ENDPOINTETAT, { newStatus })
      .then(() => {
        notifySuccess(`L'utilisateur à maintenant le status "${newStatus}"`);
        setUpdate(!update);
      })
      .catch(() => {
        notifyError("Une erreur est survenue lors de la mise à jour.");
      });
  };

  const inscritButton = () => {
    return (
      <div
        role="button"
        tabIndex={0}
        className="button-blue"
        onClick={() => handleStatus("inscrit")}
      >
        Mettre l'utilisateur en status "inscrit"
      </div>
    );
  };
  const refuseButton = () => {
    return (
      <div
        role="button"
        tabIndex={0}
        className="button-blue"
        onClick={() => handleStatus("refusé")}
      >
        Refuser le pré-inscription de l'utilisateur
      </div>
    );
  };
  const banniButton = () => {
    return (
      <div
        role="button"
        tabIndex={0}
        className="button-blue"
        onClick={() => handleStatus("banni")}
      >
        Bannir l'utilisateur
      </div>
    );
  };

  const modifEtat = () => {
    /*
     ** Depending of the actual status of the user,
     ** show only buttons that make sens
     */
    switch (etat) {
      case "pré-inscrit":
        return (
          <>
            {inscritButton()} {refuseButton()} {banniButton()}
          </>
        );
      case "inscrit":
        return <>{banniButton()}</>;
      case "refusé":
        return (
          <>
            {inscritButton()} {banniButton()}
          </>
        );
      case "banni":
        return <>{inscritButton()}</>;
      default:
        return "";
    }
  };

  return (
    <>
      <hr className="profilinter-hr" />
      <p className="bold">{`Cet utilisateur est actuellement ${etat}.`}</p>
      <div className="profilinter-button">{modifEtat()}</div>
    </>
  );
}

export default ProfilStatusModification;
