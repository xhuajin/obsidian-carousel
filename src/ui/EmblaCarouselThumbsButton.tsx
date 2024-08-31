import React from "react";

type PropType = {
	selected: boolean;
	url: string;
	onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
	const { selected, url, onClick } = props;

	return (
		<div
			className={"embla-thumbs__slide".concat(
				selected ? " embla-thumbs__slide--selected" : ""
			)}
		>
			<button
				onClick={onClick}
				type="button"
				className="embla-thumbs__slide__img"
			>
				<img className="embla__slide__img" src={url} alt={url} />
			</button>
		</div>
	);
};
