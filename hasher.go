package main

import (
  "os"
  "fmt"
  "strconv"
  "math/big"
  "encoding/hex"
  "crypto/sha256"
)

func doubleHash(blockHeader string) []byte {
  hash := sha256.New()
  hashX2 := sha256.New()
  hash.Write([]byte(blockHeader))
  hashX2.Write(hash.Sum(nil))
  return hashX2.Sum(nil)
}

func findBlockHashAsync(start int, step int, partialHeader *string, target *string, foundHash *string) {
  hashValue := new(big.Int)
  targetValue := new(big.Int)
  nonce := start
  limit := nonce + step - 1
  blockHeader := *partialHeader + "|" + strconv.Itoa(nonce)
  hash := doubleHash(blockHeader)

  hashValue.SetBytes(hash)
  targetValue.SetString(*target, 16)

  for hashValue.Cmp(targetValue) > -1 {

    if len(*foundHash) > 0 {
      return
    }

    nonce += 1

    if nonce == limit {
      nonce += 100000000
      limit += nonce + step - 1
    }

    blockHeader = *partialHeader + "|" + strconv.Itoa(nonce)
    hash = doubleHash(blockHeader)
    hashValue.SetBytes(hash)
  }

  *foundHash = hex.EncodeToString(hash) + "|" + strconv.Itoa(nonce)
  fmt.Printf("%s", *foundHash)
}

func main() {
  var blockHash string
  var nonceBase int

  baseInt, _ := strconv.ParseInt(os.Args[1], 10, 64)
  partialHeader := os.Args[2]
  target := os.Args[3]

  nonceBase = int(baseInt)

  go findBlockHashAsync(1 + nonceBase, 50000000, &partialHeader, &target, &blockHash)
  go findBlockHashAsync(50000000 + nonceBase, 50000000, &partialHeader, &target, &blockHash)
  go findBlockHashAsync(100000000 + nonceBase, 50000000, &partialHeader, &target, &blockHash)

  var input string
  fmt.Scanln(&input)
}
