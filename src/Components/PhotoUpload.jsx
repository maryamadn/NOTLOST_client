const PhotoUpload = ({ setImagesSelected, setPhotosUploaded }) => {

  return (
    <>
      <input
        type="file"
        id="fileInput"
        multiple
        onChange={(e) => {
          setImagesSelected(e.target.files);
          console.log(Object.values(e.target.files).length)
          if (Object.values(e.target.files).length !== 0) {
            setPhotosUploaded(true);
          } else {
            setPhotosUploaded(false);
          }
        }}
      />
    </>
  );
};

export default PhotoUpload;
