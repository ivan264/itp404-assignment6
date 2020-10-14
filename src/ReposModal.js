import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// will need to pass in the function to close the modal and the url for the repos
export default function ReposModal({ onClose, reposUrl }) {
  const [loading, setLoading] = useState(false);
  const [memberRepos, setMemberRepos] = useState([]);

  // useeffect to only render information when the reposURL is updated
  // ~added the [reposUrl] because of a react warning
  useEffect(() => {
    setLoading(true);
    fetch(reposUrl, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // set data to memberRepos
        setMemberRepos(data);
        // set loading to false
        setLoading(false);
      });
  }, [reposUrl]);

  return createPortal(
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal" tabIndex="-1" style={{ display: "block"}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Repos</h5>
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
              {/* add in peritnent information here */}
              {/* if the data is still loading, display a loader */}
              {loading && <div className="loader"></div>}
              {/* if the memberRepos information has been set then map information */}
              {memberRepos.length > 0 &&
                memberRepos.map((repo) => {
                  return (
                    <div key={repo.id}>
                      {/* display a link that opens up to the html_url */}
                      <a
                        target="_blank"
                        href={repo.html_url}
                        rel="noopener noreferrer"
                      >
                        Name: {repo.name}
                      </a>
                      {/* if the repo has a description display it, otherwise show 'n/a' */}
                      <p>Description: {repo.description ? repo.description : "n/a"}</p>
                      <hr></hr>
                    </div>
                    
                  );
                })}
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
    document.getElementById("repos-modal")
  );
}
