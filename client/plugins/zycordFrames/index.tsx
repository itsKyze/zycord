/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import definePlugin from "@utils/types";
import { useEffect, useRef } from "@webpack/common";

import { ZycordAuthor } from "../zycordCore/shared";
import managedStyle from "./style.css?managed";

interface ProfileFrame {
    innerWidth: number;
    overflowTop: number;
    overflowBottom: number;
    overflowHorizontal: number;
}

const FRAMED = "zycord-framed-sidebar";
const VARS = ["--zycord-frame-top", "--zycord-frame-bottom"];

// the profile frame across the whole side profile, like the profile popout, instead of only its top layers in the footer.
// Like discord's own side profile, the card keeps the full width and only moves down to make room for the art above it;
// the art reaching past its sides just hangs over the edges
function SidebarFrame({ Frame, frame }: { Frame?: (props: { frame: ProfileFrame }) => JSX.Element; frame?: ProfileFrame }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!frame || !frame.innerWidth) return;
        const sidebar = ref.current?.closest<HTMLElement>(".user-profile-sidebar");
        const space = sidebar?.parentElement;
        if (!sidebar || !space) return;
        const apply = () => {
            try {
                if (!frame || !frame.innerWidth || !space) return;
                const scale = space.clientWidth / frame.innerWidth;
                sidebar.style.setProperty(VARS[0], `${Math.round((frame.overflowTop || 0) * scale)}px`);
                sidebar.style.setProperty(VARS[1], `${Math.round((frame.overflowBottom || 0) * scale)}px`);
            } catch (_) {}
        };
        try {
            apply();
            sidebar.classList.add(FRAMED);
            const observer = new ResizeObserver(apply);
            observer.observe(space);
            return () => {
                observer.disconnect();
                sidebar.classList.remove(FRAMED);
                for (const name of VARS) sidebar.style.removeProperty(name);
            };
        } catch (_) {}
    }, [frame]);
    if (!Frame) return null;
    try {
        return (
            <div ref={ref} style={{ display: "contents" }}>
                <Frame frame={frame!} />
            </div>
        );
    } catch (_) {
        return null;
    }
}

export default definePlugin({
    name: "ZycordFrames",
    description: "Draws profile frames around the whole side profile in DMs, with room above and below the card for the art, instead of only their top layers in its footer.",
    authors: [ZycordAuthor],
    required: true,
    managedStyle,

    SidebarFrame,

    patches: [
        {
            // the side profile's footer, which draws the frame's top layers squeezed into it
            find: /\.xQ,children:\[\(0,\i\.jsx\)\(\i\.\i,\{frame:\i,filterLayer:\i\}\)/,
            replacement: {
                match: /\.xQ,children:\[\(0,(\i)\.jsx\)\((\i\.\i),\{frame:(\i),filterLayer:\i\}\)/,
                replace: ".xQ,children:[(0,$1.jsx)($self.SidebarFrame,{Frame:$2,frame:$3})",
            },
        },
    ],
});
