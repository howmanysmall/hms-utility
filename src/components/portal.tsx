//!native
//!nonstrict
//!optimize 2

import React from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";

export interface PortalProperties extends React.PropsWithChildren {
	readonly target: Instance;
}

export function PortalNoMemo({ children, target }: PortalProperties): React.ReactElement {
	// biome-ignore lint/complexity/noUselessFragments: this is necessary ):
	return createPortal(<>{children}</>, target);
}

export const Portal = React.memo(PortalNoMemo);
Portal.displayName = "Portal";
export default Portal;
