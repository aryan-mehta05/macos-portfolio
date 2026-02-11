import Calendar from "#components/widgets/Calendar";
import Weather from "#components/widgets/Weather";
import Notes from "#components/widgets/Notes";

const WidgetBlock = () => {
  return (
    <div className="absolute m-1.5">
      <div className="flex gap-1.5">
        <Calendar />
        <Weather />
      </div>
      <Notes className="mt-1.5" />
    </div>
  );
};

export default WidgetBlock;
