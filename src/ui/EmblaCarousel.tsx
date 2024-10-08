import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import React, { useCallback, useEffect, useState } from "react";

import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import { CarouselOptions } from "src/types";
import Fade from "embla-carousel-fade";
import { Thumb } from "./EmblaCarouselThumbsButton";
import useEmblaCarousel from "embla-carousel-react";

// import AutoHeight from "embla-carousel-auto-height";

type PropType = CarouselOptions;

const EmblaCarousel: React.FC<PropType> = (props) => {
	const {
		options,
		slides,
		height,
		slidessize,
		autoplay,
		autoscroll,
		fade,
		thumb,
	} = props;
	const plugins = [];

	if (fade) {
		plugins.push(Fade());
	} else {
		if (autoplay) {
			plugins.push(Autoplay({ playOnInit: true }));
		} else if (autoscroll) {
			plugins.push(AutoScroll({ playOnInit: true }));
		}
	}

	const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);

	const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
		containScroll: "keepSnaps",
		dragFree: true,
	});
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onThumbClick = useCallback(
		(index: number) => {
			if (!emblaApi || !emblaThumbsApi) return;
			emblaApi.scrollTo(index);
		},
		[emblaApi, emblaThumbsApi]
	);

	const onSelect = useCallback(() => {
		if (!emblaApi || !emblaThumbsApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
		emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap());
	}, [emblaApi, emblaThumbsApi, setSelectedIndex]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();

		emblaApi.on("select", onSelect).on("reInit", onSelect);
	}, [emblaApi, onSelect]);

	return (
		<>
			<section
				className={`embla embla-axis-${
					options?.axis ? options.axis : "x"
				}`}
				style={
					{
						"--slide-height": height,
						"--slide-size": slidessize,
					} as React.CSSProperties
				}
			>
				<div className="embla__controls">
					<div className="embla__buttons">
						<PrevButton
							onClick={onPrevButtonClick}
							disabled={prevBtnDisabled}
						/>
					</div>
				</div>

				<div className="embla__viewport" ref={emblaRef}>
					<div className="embla__container">
						{slides.map((url, index) => (
							<div className="embla__slide" key={index}>
								<img
									className="embla__slide__img"
									src={url}
									alt={url}
								/>
							</div>
						))}
					</div>
				</div>

				<div className="embla__controls">
					<div className="embla__buttons">
						<NextButton
							onClick={onNextButtonClick}
							disabled={nextBtnDisabled}
						/>
					</div>
				</div>
			</section>
			{thumb && (
				<div className="embla-thumbs">
					<div
						className="embla-thumbs__viewport"
						ref={emblaThumbsRef}
					>
						<div className="embla-thumbs__container">
							{slides.map((url, index) => (
								<Thumb
									key={index}
									onClick={() => onThumbClick(index)}
									selected={index === selectedIndex}
									url={url}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default EmblaCarousel;
