import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// need to recieve who got clicked(the url of the profile); and the function to close the modal
export default function ProfileModal({ onClose, memberUrl }) {
  // boolean to determine if the data has been loaded
  const [loading, setLoading] = useState(false);
  // object that holds the member's data
  const [memberData, setMemberData] = useState({});

  // use effect to render only when memberURL is updated
  // ~ did this because of a react warning
  useEffect(() => {
    setLoading(true);
    fetch(memberUrl, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // set the data we recieved to memberData
        setMemberData(data);
        // set loading to false
        setLoading(false);
      });
  }, [memberUrl]);

  return createPortal(
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Member Profile</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* here add in pertinent information */}
              {/* if the data is still being rendered show a loader */}
              {loading && <div className="loader"></div>}
              {/* if the data has finished loading, */}
              {!loading && (
                <>
                {/* then display the name of the member, company and number of public repos  */}
                  <div>Name: {memberData.name}</div>
                  <div>
                    {/* if the member has a company aka not null then display the company name otherwise say 'n/a' */}
                    Company: {memberData.company ? memberData.company : "n/a"}
                  </div>
                  <div>Public Repos: {memberData.public_repos} </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("profile-modal")
  );
}
