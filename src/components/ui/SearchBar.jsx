import React from "react";
import icons from "../../constants/icons";

const SearchBar = ({ searchQuery, onSearch }) => {
  const styles = {
    search: {
      position: "relative",
    },
    input: {
      background: "#DEE4ED",
      width: "280px",
      height: "34px",
      borderRadius: "7px",
      border: "none",
      paddingLeft: "30px",
    },
    img: {
      position: "absolute",
      top: "8px",
      left: "10px",
    },
    placeholder: {
      color: "#525E6F",
      fontSize: "12px",
      fontWeight: "400",
      lineHeight: "15px",
    },
  };

  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div style={styles.search}>
      <img src={icons.search} alt="Search" style={styles.img} />
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search Guest"
        style={styles.input}
      />
    </div>
  );
};

export default SearchBar;
