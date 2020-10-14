import React, { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import ReposModal from "./ReposModal";
import {
  fetchEmberMembers,
  fetchFollows,
  addFollow,
  deleteFollow,
} from "./api";


export default function RenderMembers() {
  // members holds the array of ember members
  const [members, setMembers] = useState([]);
  // used to keep track if data is being loaded
  const [loading, setLoading] = useState(false);

  // boolean used to dermine if the profileModal should be displayed
  const [isProfileModal, setIsProfileModal] = useState(false);
  // used to hold the information that will be passed to the ProfileModal component
  const [memberUrl, setMemberUrl] = useState("");

  // used to determine if the ReposModal should be displayed
  const [isReposModal, setIsReposModal] = useState(false);
  // used to hold the url that will be passed to the ReposModal component
  const [reposUrl, setReposUrl] = useState("");

  // an array of who has been followed (from my api)
  const [followed, setFollowed] = useState([]);

  useEffect(() => {
    setLoading(true);
    // promise to fetch the ember members from github api
    // and fetch who has been followed from my api
    Promise.all([fetchEmberMembers(), fetchFollows()]).then(
      ([returnedMembers, returnedFollows]) => {
        // set members
        setMembers(returnedMembers);
        //set folllowed
        setFollowed(returnedFollows);
        // set Loading
        setLoading(false);
      }
    );
  }, []);

  // this function will be used if the user clicks on the 
  // profile picture or login. It takes 'data' as a parameter
  // which is just the url for the ember member's github profile
  function showProfileModal(data) {
    // used to display the modal
    setIsProfileModal(true);
    // set the memberUrl to pass into the profile modal componet
    setMemberUrl(data);
  }

  // this function is called when the user clicks on the 'x' or the
  // 'close' button to close the profile modal
  function closeProfileModal() {
    setIsProfileModal(false);
  }

  // this function will be used if the user clicks on the 
  // repos button. It takes 'data' as a parameter
  // which is just the url for the ember member's repos
  function showReposModal(data) {
    // used to display the reposModal
    setIsReposModal(true);
    // set the reposUrl to data
    setReposUrl(data);
  }

  // this function is called when the user clicks on the 'x' or the
  // 'close' button to close the repos modal
  function closeReposModal() {
    setIsReposModal(false);
  }

  // this function is called when the user clicks on the follow button.
  // it takes in the memberID, and loginName as parameters.
  function followClicked(memberID, loginName) {
    // call the function to add json object that contains
    // the id of the member followed and the login name
    addFollow({
      id: memberID,
      login: loginName,
    }).then((newFollow) => {
      // 'update' the list of people followed
      setFollowed(followed.concat(newFollow));
    });
  }

  // this function is called when the user clicks on the unfollow button.
  // it takes in the memberID as its parameter.
  function unfollowClicked(memberID) {
    // call the deleteFollow function to delete the json object from my api
    // whose id matches the memberID parameter
    deleteFollow(memberID).then(() => {
      // use the filter function to return an array whose id does not
      // match the id of the member that was unfollowed
      const filteredFollowed = followed.filter((follow) => {
        return follow.id !== memberID;
      });
      // update the list of people followed
      setFollowed(filteredFollowed);
    });
  }

  // this function is called when the page is refreshed or the user
  // has clicked on the follow or unfollow buttons.
  // it takes in the ember member's id as a parameter
  function loadButton(memberID) {
    // assume that the person has not been followed yet
    let beenFollowed = false;
    // iterate through the list of people that have been followed
    followed.forEach((follow) => {
      // if there is a match between the list and and the parameter
      if (follow.id === memberID) {
        // then we set beenFollowed to true to signify that the person
        // with the parameter as its id has been followed
        beenFollowed = true;
      }
    });

    // return beenFollowed
    return beenFollowed;
  }

  return (
    <>
      {/* if the boolean to show profileModal is true then show the ProfileModal component */}
      {isProfileModal && (
        <ProfileModal onClose={closeProfileModal} memberUrl={memberUrl} />
      )}
      {/* if the boolean to show the reposModal is true then show the ReposModal component */}
      {isReposModal && (
        <ReposModal onClose={closeReposModal} reposUrl={reposUrl} />
      )}
      {/* if the data is still being loaded display a loader */}
      {loading && <div className="loader"></div>}
      <div className="container mb-5">
        <div className="row">
          {/* if members has been set then display all the members */}
          {members.length > 0 &&
            members.map((member) => {
              return (
                <div className="col-4" key={`information for ${member.login}`}>
                  <div className="col-12 text-center mt-4 member-item">
                    {/* display a responsive image */}
                    <img
                      src={member.avatar_url}
                      alt={`avatar of ${member.login}`}
                      width="200"
                      heigh="200"
                      className="img-fluid img-thumbnail pointer"
                      // when the image is clicked show the profileModal
                      onClick={() => showProfileModal(member.url)}
                    />
                    <p
                      className="pt-2 pointer"
                      // when the login name is clicked show the profileModal
                      onClick={() => showProfileModal(member.url)}
                    >
                      Login: {member.login}
                    </p>
                    {/* button for the repos */}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      // when the button is clicked show the ReposModal component
                      onClick={() => showReposModal(member.repos_url)}
                    >
                      Repos
                    </button>
                    {/* call the loadButton function that returns a boolean */}
                    {loadButton(member.id) ? (
                      // if true then return a button that shows 'Unfollow' and if clicked
                      // will delete a person as followed from the api 
                      <button
                        type="button"
                        className="btn btn-danger ml-2"
                        onClick={() => unfollowClicked(member.id)}
                      >
                        Unfollow?
                      </button>
                    ) : (
                      // if false, then returna button that shows 'Follow' and if clicked,
                      // will add a person as followed to the api
                      <button
                        type="button"
                        className="btn btn-light ml-2"
                        onClick={() => followClicked(member.id, member.login)}
                      >
                        Follow?
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
