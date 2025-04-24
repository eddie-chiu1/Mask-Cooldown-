const BossStatus = Java.type("net.minecraft.entity.boss.BossStatus")
import PogData from "PogData"

let showOverlay = false

register("tick", () => {
    const bossName = BossStatus.field_82827_c
    if (bossName && bossName.removeFormatting().includes("Maxor")) {
        showOverlay = true
    }
})

// cooldown struct
const cooldowns = {
    Bonzo: { duration: 180, lastUsed: 0 },
    Spirit: { duration: 30, lastUsed: 0 },
    Phoenix: { duration: 60, lastUsed: 0 }
}

// position shit
const data = new PogData("maskcdtimers", {
    x: 10,
    y: 10
}, "data.json")

let dragging = false

// boss bar shit
function isInBoss() {
    return BossStatus.field_82825_d
}

// mask detection
register("chat", (event) => {
    const rawMsg = ChatLib.getChatMessage(event)
    const msg = ChatLib.removeFormatting(rawMsg)

    if (msg.includes("Bonzo's Mask saved your life")) {
        cooldowns.Bonzo.lastUsed = Date.now()
        showOverlay = true;
    } else if (msg.includes("Spirit Mask saved your life")) {
        cooldowns.Spirit.lastUsed = Date.now()
        showOverlay = true;
    } else if (msg.includes("Phoenix Pet saved you from certain death")) {
        cooldowns.Phoenix.lastUsed = Date.now()
        showOverlay = true;
    }
})

// dragging shit
register("command", () => {
    dragging = !dragging
    ChatLib.chat(`&b[maskcd] Dragging ${dragging ? "&aenabled" : "&cdisabled"}`)
}).setName("dragcd")

register("command", () => {
    showOverlay = !showOverlay
    ChatLib.chat(`&b[maskcd] Overlay ${showOverlay ? "&aenabled" : "&cdisabled"}`)
}).setName("togglecd")

// rendering shit
register("renderOverlay", () => {
    if (!showOverlay && !dragging) return

    const now = Date.now()
    let y = data.y

    Object.entries(cooldowns).forEach(([name, info]) => {
        const timePassed = (now - info.lastUsed) / 1000
        const remaining = info.duration - timePassed
        const isReady = info.lastUsed === 0 || remaining <= 0

        // color for each mask because im quirky like that
        let nameColor = {
            Bonzo: "&9",
            Spirit: "&f",
            Phoenix: "&6"
        }[name] || "&f"

        let text = isReady
            ? `${nameColor}${name} &e> &eREADY`
            : `${nameColor}${name} &e> &c${remaining.toFixed(1)}s`

        Renderer.drawStringWithShadow(ChatLib.addColor(text), data.x, y)
        y += 12
    })

    if (dragging) {
        Renderer.drawRect(Renderer.color(255, 255, 255, 40), data.x - 2, data.y - 2, 100, 40)
    }
})


// dragging
register("dragged", (dx, dy, x, y, btn) => {
    if (!dragging) return
    data.x = x
    data.y = y
    data.save()
})

// world change
register("worldUnload", () => {
    showOverlay = false
    Object.values(cooldowns).forEach(c => c.lastUsed = 0)
})


// chatgpt told me to add this
ChatLib.chat("&a[maskcd] module loaded")
