export const Card = ({
  imageFront,
  imageBack,
  cardContent,
  active,
  onAnimationEnd,
  onClose,
  animationDuration = 1,
}: {
  imageFront: string;
  imageBack: string;
  cardContent: { fuseItems: string; result: string };
  active?: boolean;
  onAnimationEnd?: Function;
  onClose?: Function;
  animationDuration?: number;
}) => {
  if (cardContent.result === "" || cardContent.fuseItems === "") return null;
  return (
    <div className={`card ${active ? "flipped" : ""}`}>
      <div
        className="card-inner"
        style={{ transitionDuration: `${animationDuration}s` }}
        // onTransitionEnd={() => onAnimationEnd && onAnimationEnd()}
      >
        <div className="card-front">
          <img src={imageFront} alt="Front" className="card-image" />
        </div>
        <div className="card-back">
          <div className="card-content">
            <h1>{cardContent.fuseItems}</h1>
            <h1>=</h1>
            <h2>{cardContent.result}</h2>
          </div>
          <img src={imageBack} alt="Back" className="card-image-background" />
        </div>
      </div>
      <button className="close-button" onClick={() => onClose && onClose()}>
        Close
      </button>
    </div>
  );
};
export default Card;
