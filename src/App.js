import { useEffect, useRef, useState } from "react";
import "./App.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState([]);
  const inputRef = useRef();

  const localData = () => {
    let getLocalStorage = JSON.parse(localStorage.getItem("image_library"));
    if (getLocalStorage) {
      setData(getLocalStorage);
    }
  };

  useEffect(() => {
    localData();
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setImage(event.dataTransfer.files[0]);
  };

  const handleButton = () => {
    setDisabled(true);
    upload();
  };

  const upload = async () => {
    try {
      let res = await Axios.post(
        "https://api.imgbb.com/1/upload?expiration=600&key=0c0d072baabea190f9fe1996bd9f5020",
        { image },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setDisabled(false);
      setImage(null);
      let oldData = JSON.parse(localStorage.getItem("image_library"));
      if (oldData) {
        let newData = [...oldData, res.data.data.url];
        localStorage.setItem("image_library", JSON.stringify(newData));
      } else {
        let newData = [];
        newData.push(res.data.data.url);
        localStorage.setItem("image_library", JSON.stringify(newData));
      }
      alert("Upload success");
      window.location.reload(false);
    } catch (error) {
      console.log(error);
      alert("Upload error");
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center bg-dark"
        style={{ height: "100px" }}
      >
        <h4 className="text-light fw-semibold">Image Library</h4>
      </div>
      <div className="m-5">
        <div className="bg-light rounded p-5">
          {image ? (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="fw-semibold">{image.name}</p>
                {[
                  "image/jpg",
                  "image/jpeg",
                  "image/bmp",
                  "image/png",
                  "image/gif",
                ].includes(image.type) ? null : (
                  <p className="text-danger">Unsupported format</p>
                )}
                {image.size >= 2097152 ? (
                  <p className="text-danger">Max allowed size is 2MB</p>
                ) : null}
              </div>
              <div className="d-flex flex-column gap-3">
                {![
                  "image/jpg",
                  "image/jpeg",
                  "image/bmp",
                  "image/png",
                  "image/gif",
                ].includes(image.type) || image.size >= 2097152 ? null : (
                  <button
                    type="button"
                    className="btn btn-success fw-semibold"
                    onClick={handleButton}
                    disabled={disabled}
                  >
                    Upload
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-danger fw-semibold"
                  onClick={() => setImage(null)}
                  disabled={disabled}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ cursor: "pointer" }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
              >
                <AiOutlineCloudUpload size={70} />
                <p className="mt-2">Drag and drop file here or click</p>
              </div>
              <input
                type="file"
                hidden
                ref={inputRef}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </>
          )}
        </div>
        <h4 className="mt-5">Gallery</h4>
        {data.length > 0 ? (
          <div className=" mt-5 d-flex justify-content-start gap-3 flex-wrap">
            {data.map((val) => {
              return (
                <a href={val} target="_blank" rel="noopener noreferrer">
                  <img
                    src={val}
                    key={val}
                    alt=""
                    style={{ height: "100px", objectFit: "contain" }}
                  />
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
