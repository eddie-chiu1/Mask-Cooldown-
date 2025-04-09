
// cooldown
const cooldowns = {
    Bonzo: { duration: 180, lastUsed: 0 },
    Spirit: { duration: 30, lastUsed: 0 },
    Phoenix: { duration: 60, lastUsed: 0 }
}

// detection
register("chat", (event) => {
    const msg = ChatLib.getChatMessage(event)

    if (/Bonzo's Mask/.test(msg)) {
        cooldowns.Bonzo.lastUsed = Date.now()
    } else if (/Spirit Mask/.test(msg)) {
        cooldowns.Spirit.lastUsed = Date.now()
    } else if (/Phoenix Pet/.test(msg)) {
        cooldowns.Phoenix.lastUsed = Date.now()
    }
}).setCriteria(/saved your life|Second Wind Activated|certain death/)

// rendering
register("renderOverlay", () => {
    const now = Date.now()
    let y = 10

    Object.entries(cooldowns).forEach(([name, data]) => {
        const timePassed = (now - data.lastUsed) / 1000
        const remaining = data.duration - timePassed
        let text = ""

        if (remaining > 0) {
            text = `&c${name}: ${remaining.toFixed(1)}s`
        } else {
            // text = `&a${name}: READY`
            text = ""
        }

        Renderer.drawString(ChatLib.addColor(text), 10, y)
        y += 12
    })
})

// resets when changing worlds
register("worldUnload", () => {
    Object.values(cooldowns).forEach(c => c.lastUsed = 0)
})

// chat on launch to make sure it loads lmfao
ChatLib.chat(`&a[maskcd] Module loaded successfully.`);
