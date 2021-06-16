import { useContext, useState } from "react";
import { Context } from "../../App";
import styles from "./Editor.module.css";

interface IEvent {
  target: {
    value: string;
  };
}

const mobileWidth = 750;

const Editor = () => {
  const { data, setData } = useContext(Context);
  const [editorData, updateEditor] = useState(data);
  const [expanded, expand] = useState(window.innerWidth > mobileWidth);

  const onChange = ({ target: { value } }: IEvent) => {
    updateEditor(value);
  };

  const saveChanges = () => {
    localStorage.setItem("yamlFile", editorData);
    setData(editorData);
    expand(false);
  };

  const expandEditor = () => expand(true)

  if (!expanded && window.innerWidth < mobileWidth)
    return (
      <div className={styles.container}>
        <button onClick={expandEditor} className={styles["expand-btn"]}>
          Edit
        </button>
      </div>
    )

  return (
    <div className={styles.container}>
      <textarea
        className={styles.editor}
        value={editorData}
        onChange={onChange}
        spellCheck="false"
      />
      <button onClick={saveChanges} className={styles["save-btn"]}>
        Save
      </button>
    </div>
  );
};

export { Editor };
