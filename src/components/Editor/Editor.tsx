import { useContext, useState } from "react";
import { Context } from "../../App";
import styles from "./Editor.module.css";

interface IEvent {
  target: {
    value: string;
  };
}

const Editor = () => {
  const { data, setData } = useContext(Context);
  const [editorData, updateEditor] = useState(data);

  const onChange = ({ target: { value } }: IEvent) => {
    updateEditor(value);
  };

  const saveChanges = () => {
    localStorage.setItem("yamlFile", editorData);
    setData(editorData);
  };

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
