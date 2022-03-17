import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Cancel } from "@material-ui/icons";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      data.append("upload_preset", "mekele");
      //data.append("cloud_name", "mekele");

      // console.log(newPost);
      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/mekele/image/upload",
          data
        );
        console.log(response.data.public_id, "cloudinary");
        const profilePicId = response.data.public_id;

        try {
          await axios.post("/posts", profilePicId);
          window.location.reload();
        } catch (err) {}
      } catch (err) {}
      // try {
      //   await axios.post("/upload", data);
      // } catch (err) {}
    }
  };

  const profileImage = () => {
    return (
      <>
        <img
          className="profileCoverImg"
          src={
            user.coverPicture
              ? PF + user.coverPicture
              : PF + "person/noCover.png"
          }
          alt=""
        />
        <img
          className="profileUserImg"
          src={
            user.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""
        />
        <input
          className="inputProfilePic"
          type="file"
          id="file"
          accept=".png,.jpeg,.jpg"
          onChange={(e) => submitHandler(e)}
        />
      </>
    );
  };
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">{profileImage()}</div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
