const genMerkelHash = (poolTxnHashes) => {
  const treeParse = (hashes) => {
    let tempTree = [];

    for (let i = 0; i < hashes.length; i += 1) {
      if ((i + 1) % 2 === 0) continue

      const ha = hashes[i]
      let hb = hashes[i + 1]

      if (!hb) hb = ha

      let hashConcat = Buffer.concat([
        new Buffer(ha),
        new Buffer(hb)
      ])

      let nodeHash = sha256.x2(hashConcat)
      tempTree.push(nodeHash);
    }

    if (tempTree.length === 1)
      return tempTree[0]

    return treeParse(tempTree)
  }
  return treeParse(poolTxnHashes);
};

module.exports = genMerkelHash
