var rbt = require('../utils/rbt')

export const genTree = (simTree, tgd, notifier, syncTime) => {
    // const newSimTree = {
    //     val, id, message, op, isVal, isId, isM
    // }

    if(tgd.op === "s"){
        simTree = new rbt.RBT()
    }

    else if(tgd.op === "i"){
        simTree.insert('n', tgd.val, tgd.id)
    }

    else if(tgd.op === "r"){
        if(simTree !== null && simTree.min() !== null){
            simTree.remove(simTree.min())
        }
    }


    if(tgd.isM === 1){
        notifier.message = tgd.message
        notifier.eTime = syncTime
    }

    notifier.id = tgd.id

    return simTree
}

