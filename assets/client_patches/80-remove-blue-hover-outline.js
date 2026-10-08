(() => {
    // Injects global CSS to eliminate unwanted blue (#5865f2) outlines and borders
    // on hover, focus, and selection across call tiles, video grid, and profile cards.
    const style = document.createElement("style");
    style.id = "zycord-remove-blue-hover-outline";
    style.textContent = `
        /* 1. Remove blue border and outline on voice and video tiles in calls */
        [data-call-tile],
        [data-selenium-video-tile],
        .tile__90dc5,
        div[class*="tile__"],
        div[class*="tile_"] {
            border: 2px solid transparent !important;
            outline: none !important;
            box-shadow: none !important;
        }

        [data-call-tile]:hover,
        [data-call-tile]:focus,
        [data-call-tile]:focus-visible,
        [data-call-tile]:focus-within,
        [data-call-tile][class*="selected"],
        [data-call-tile][class*="focused"],
        [data-selenium-video-tile]:hover,
        [data-selenium-video-tile]:focus,
        [data-selenium-video-tile]:focus-visible,
        [data-selenium-video-tile]:focus-within,
        [data-selenium-video-tile][class*="selected"],
        [data-selenium-video-tile][class*="focused"],
        .tile__90dc5:hover,
        .tile__90dc5:focus,
        .tile__90dc5:focus-visible,
        .tile__90dc5:focus-within,
        div[class*="tile__"]:hover,
        div[class*="tile__"]:focus,
        div[class*="tile__"]:focus-visible,
        div[class*="tile__"]:focus-within,
        div[class*="tile_"]:hover,
        div[class*="tile_"]:focus,
        div[class*="tile_"]:focus-visible,
        div[class*="tile_"]:focus-within {
            border: 2px solid transparent !important;
            outline: none !important;
            box-shadow: none !important;
        }

        /* 2. Remove coachmark target rings and blue highlights on profile/badge editor */
        div[class*="coachmarkTarget_"],
        div[class*="coachmark_"],
        div[class*="badgeList_"],
        div[class*="badges_"] {
            outline: none !important;
            box-shadow: none !important;
        }

        /* 3. Disable browser default blue focus ring */
        *:focus-visible {
            outline: none !important;
        }
    `;

    if (document.head) document.head.appendChild(style);
    else document.addEventListener("DOMContentLoaded", () => document.head?.appendChild(style));
})();
