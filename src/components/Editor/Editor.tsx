import { useContext, useState } from "react";
import { Context } from "../../App";
import styles from "./Editor.module.css";

interface IEvent {
  target: {
    value: string;
  };
}

const mobileWidth = 750;

const Editor = ({ loading }: { loading: boolean }) => {
  const { data, setData } = useContext(Context);
  const [editorData, updateEditor] = useState(data);
  const [expanded, expand] = useState(window.innerWidth > mobileWidth);

  const onChange = ({ target: { value } }: IEvent) => {
    updateEditor(value);
  };

  const saveChanges = async () => {
    localStorage.setItem("mdFile", editorData);
    setData(editorData);
    expand(false);
  };

  const expandEditor = () => expand(true);

  if (!expanded && window.innerWidth < mobileWidth)
    return (
      <div className={styles.container}>
        <button onClick={expandEditor} className={styles.expandBtn}>
          Edit
        </button>
      </div>
    );

  return (
    <div className={styles.container}>
      <textarea
        className={styles.editor}
        value={editorData}
        onChange={onChange}
        spellCheck="false"
      />
      <button
        disabled={loading}
        onClick={saveChanges}
        className={styles.saveBtn}
      >
        Save
      </button>
    </div>
  );
};

export { Editor };
