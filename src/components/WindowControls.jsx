import useWindowStore from "#store/window";
import { X, Minus, Plus } from "lucide-react";

const WindowControls = ({ target }) => {
  const { closeWindow } = useWindowStore();
  
  return (
    <div id="window-controls">
      <X className="close text-white p-0.5" fill="white" strokeWidth={3} onClick={() => closeWindow(target)} />
      <Minus className="minimize text-white p-0.5" fill="white" strokeWidth={3} />
      <Plus className="maximize text-white p-0.5" fill="white" strokeWidth={3} />
    </div>
  );
};

export default WindowControls;
