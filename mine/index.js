
const _ = require('lodash')
const max_size = 10e5;
const merkle = require('merkle');
const fee_rate = 1;//14000;
const api = require('../api')
let reward_network;
const public_key_compressed = '2bfcc6808f5679ee357590f8ff126ec01cfc061a';
const public_address = '151asPhV5TDuPMsinMGVDiQQos9N9epBP4'
const sha256 = require('sha256')
const { spawn } = require('child_process');
const child = spawn('pwd');


function Mine() {
  this.reward_network = 50e8;
}

const get_txn_hashes = (pool_transactions) => {
  return pool_transactions.map((transaction) => {
    return transaction.hash;
  });
}

Mine.prototype.add_transaction = function (transaction) {
  let container = this.calculate_fee(transaction);
  if (!container.isValid)
    return

  let total_size = _.sumBy(this.pool_transactions, function (transaction) { return transaction.size; });

  if ((total_size + container.transaction.size) < max_size) {
    this.pool_transactions.push(container.transaction);
  } else {
    this.merkle_hash = this.generate_merkle_hash(this.pool_transactions);
    this.build_block();
  }
};

Mine.prototype.generate_merkle_hash = function (pool_transactions) {
  const hashes = get_txn_hashes(pool_transactions)

  const tree_parse = (hashes) => {
    let temp_tree = [];

    for (let i = 0; i < hashes.length; i += 1) {
      if ((i + 1) % 2 === 0) continue

      const ha = hashes[i]
      let hb = hashes[i + 1]

      if (!hb) hb = ha

      let hash_concat = Buffer.concat([
        new Buffer(ha),
        new Buffer(hb)
      ])

      let node_hash = sha256.x2(hash_concat)
      temp_tree.push(node_hash);
    }

    if (temp_tree.length === 1)
      return temp_tree[0]

    return tree_parse(temp_tree)
  }

  return tree_parse(hashes);
};

Mine.prototype.build_block = function () {

  let stamp = "cryptojuanes baby !!!"
  let message = "1|" + this.prev_block.hash + "|" + this.merkle_hash + "|" +
    this.prev_block.target + "|" + stamp

  var go_process = spawn('./bin/powHash', ['inc', message, this.prev_block.target]);

  go_process.stdout.on('data', (data) => {
    let hash_block = data.toString().split('|')[0];
    let nonce = data.toString().split('|')[1];

    let transaction_fees = _.sumBy(this.pool_transactions, (item) => {
      return item.fee;
    });


    let reward = this.calculate_reward_network() + transaction_fees;


    let coin_base_transaction = this.generate_coinbase_transaction(reward);

    this.pool_transactions.push(coin_base_transaction);

    let payload = {
      prev_block_hash: this.prev_block.hash,
      hash: hash_block,
      height: this.prev_block.height + 1,
      message: stamp,
      merkle_hash: this.merkle_hash,
      transactions: this.pool_transactions,
      reward: reward,	//amount	Total reward of the block (network reward + transaction fees)
      nonce: nonce,
      nickname: 'cryptojuanes',
      target: this.prev_block.target,
      created_at: Date.now()
    }
    api.postBlock(payload).then((response) => {
      console.log('Success ...')
      this.initialize();
    }).catch((err) => {
      console.log(err.response.data);
    })

  });

};

Mine.prototype.calculate_reward_network = function () {

  let result = this.height / 90;
  let floor = Math.floor(result);


  if (floor < 1) {
    console.log(this.reward_network)
    return this.reward_network;
  }
  let div = Math.pow(2, floor);
  this.reward_network = this.reward_network / div;
  return this.reward_network;
};

Mine.prototype.initialize = function () {

  // TODO: stop go process.
  this.pool_transactions = [];
  api.pool().then((response) => {

    let pool_transactions = response.data;
    api.block_offset_height().then((response) => {
      this.blocks = response.data;
      let size_blocks = this.blocks.length;
      this.prev_block = this.blocks[size_blocks - 1];
      this.height = this.prev_block.height;

      pool_transactions.forEach((transaction) => {
        let container = this.calculate_fee(transaction);
        if (container.isValid) {
          this.pool_transactions.push(container.transaction);
        }
      });
      this.build_block();
    })
  })
};

Mine.prototype.calculate_fee = function (origin_transaction) {
  let input_sum = _.sumBy(origin_transaction.inputs, function (item) { return item.amount; });
  let output_sum = _.sumBy(origin_transaction.outputs, function (item) { return item.value; });

  let fee = input_sum - output_sum
  let transaction = JSON.parse(JSON.stringify(origin_transaction))
  transaction.fee = fee;

  return {
    isValid: ((fee >= 0) && (fee >= fee_rate)),
    transaction: transaction
  }
};

Mine.prototype.generate_coinbase_transaction = function (reward) {

  let prev_hash = "0000000000000000000000000000000000000000000000000000000000000000";
  let script_sig = "cryptojuanes baby!!!";
  let vout = "-1";

  let input_payload = Buffer.concat(
    [this.text2Binary(prev_hash, 'hex'),
    this.text2Binary(script_sig),
    this.text2Binary(vout)]
  )


  let value = reward;
  output_payload = Buffer.concat(
    [
      this.text2Binary(value.toString()),
      this.text2Binary(public_key_compressed.length.toString()),
      this.text2Binary(public_key_compressed.toString(), 'hex')
    ]
  )


  transaction = Buffer.concat(
    [
      this.text2Binary("1"),
      this.text2Binary("1"),
      this.text2Binary(input_payload, "hex"),
      this.text2Binary("1"),
      this.text2Binary(output_payload, "hex"),
      this.text2Binary("0")
    ]
  )

  hash = sha256.x2(transaction.toString('hex')).split('').reverse().join('');
  console.log(hash)
  transaction = {
    hash: hash,
    inputs: [
      {
        prev_hash: "0000000000000000000000000000000000000000000000000000000000000000",
        vout: -1,
        script_sig: "cryptojuanes baby!!!"
      }
    ],
    outputs: [
      {
        value: reward,
        script: public_key_compressed
      }
    ]
  }

  return transaction;

}

Mine.prototype.text2Binary = function (string, type) {
  return new Buffer(string, type);
};

Mine.prototype.target_changed = function (new_target) {
  this.prev_block.target = new_target;
  // TODO: stop go process.
  this.build_block();
};

module.exports = Mine;