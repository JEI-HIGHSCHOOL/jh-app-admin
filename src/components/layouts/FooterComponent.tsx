import React from "react";

const FooterComponent = () => {
  return (
    <footer className="py-16 text-center mt-auto">
      {new Date().getFullYear()} | Dohyun |{" "}
      <a
        className="font-semibold hover:underline"
        target="_blank"
        href="https://github.com/JEI-HIGHSCHOOL/meal-react-native"
        rel="noreferrer"
      >
        Github
      </a>
    </footer>
  );
};

export default FooterComponent;
