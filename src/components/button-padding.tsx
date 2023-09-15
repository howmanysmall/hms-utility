import Roact from "@rbxts/roact";

export const ButtonPadding: Roact.FunctionComponent = () => (
	<uipadding
		PaddingBottom={new UDim(0, 6)}
		PaddingLeft={new UDim(0, 12)}
		PaddingRight={new UDim(0, 12)}
		PaddingTop={new UDim(0, 6)}
	/>
);

export default Roact.memo(ButtonPadding);
