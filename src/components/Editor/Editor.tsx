import { useContext, useState } from "react";
import { Context } from "../../App";
import cs from "./Editor.module.css";

interface IEvent {
  target: {
    value: string;
  };
}

const Editor = ({
  loading,
  expanded,
  toggleEditor,
}: {
  loading: boolean;
  expanded: boolean;
  toggleEditor: any;
}) => {
  const { data, setData } = useContext(Context);
  const [editorData, updateEditor] = useState(data);

  const onChange = ({ target: { value } }: IEvent) => {
    updateEditor(value);
  };

  const saveChanges = async () => {
    localStorage.setItem("mdFile", editorData);
    setData(editorData);
    toggleEditor();
  };

  if (!expanded) return null;

  return (
    <div className={cs.container}>
      <textarea
        className={cs.editor}
        value={editorData}
        onChange={onChange}
        spellCheck="false"
      />
      <div className={cs.actionBox}>
        <button
          disabled={loading}
          onClick={toggleEditor}
          className={cs.hideBtn}
        >
          Hide
        </button>
        <button disabled={loading} onClick={saveChanges} className={cs.saveBtn}>
          Save
        </button>
      </div>
    </div>
  );
};

export { Editor };
