var binaryTree = require('../utils/bint'),
        bst = require('../utils/bst'),
        rbt = require('../utils/rbt')

export const genTree = (simTree, tgd, notifier) => {
    // const newSimTree = {
    //     val, id, message, op, isVal, isId, isM
    // }

    if(tgd.op == "s"){
        simTree = new rbt.RBT()
    }

    else if(tgd.op == "i"){
        simTree.insert('n', tgd.val, tgd.id)
    }

    else if(tgd.op == "r"){
        simTree.remove(simTree.min())
    }


    if(tgd.isM === 1){
        notifier.message = tgd.message
    }

    notifier.id = tgd.id

    return simTree
}

