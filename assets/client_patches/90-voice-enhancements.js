(() => {
    // 90-voice-enhancements.js: Unlock 1080p 60FPS / 4K Screenshare and Enable WebRTC Noise Suppression
    
    // 1. Force NoiseSuppression and EchoCancellation on getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = async (constraints) => {
            if (constraints && typeof constraints === "object" && constraints.audio) {
                if (typeof constraints.audio === "boolean") {
                    constraints.audio = {
                        noiseSuppression: true,
                        echoCancellation: true,
                        autoGainControl: true,
                        suppressLocalAudioPlayback: true,
                    };
                } else if (typeof constraints.audio === "object") {
                    constraints.audio.noiseSuppression = true;
                    constraints.audio.echoCancellation = true;
                    constraints.audio.autoGainControl = true;
                }
            }
            return originalGetUserMedia(constraints);
        };
    }

    // 2. High Quality 1080p 60FPS getDisplayMedia defaults
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getDisplayMedia = async (constraints) => {
            const finalConstraints = constraints || {};
            if (finalConstraints.video && typeof finalConstraints.video === "object") {
                finalConstraints.video.frameRate = finalConstraints.video.frameRate || { ideal: 60, max: 60 };
                finalConstraints.video.height = finalConstraints.video.height || { ideal: 1080, max: 2160 };
            }
            return originalGetDisplayMedia(finalConstraints);
        };
    }

    console.log("[VoiceEnhancements] High-definition Screenshare (1080p/60fps) and Noise Suppression active.");
})();
