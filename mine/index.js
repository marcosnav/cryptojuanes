const _ = require('lodash')
const max_size = 10e5;
const merkle = require('merkle');

function Mine(prev_block,pool_transactions) {
  this.prev_block = prev_block;
  this.pool_transactions = pool_transactions;
}

Mine.prototype.add_transaction = function (transaction) {
  let total_size = _.sumBy(this.pool_transactions, function(transaction) { return transaction.size; });
  if ((total_size + transaction.size) < max_size){
    this.pool_transactions.push(transaction);
  }else{
    //TODO: generate merkle_hash
    let merkle_hash = generate_merkle_hash(this.pool_transactions);
  }
};

Mine.prototype.generate_merkle_hash = function(pool_transactions){
  let hashes = pool_transactions.map((transaction)=>{
    return transaction.hash;
  });
  let sha256tree= merkle('sha256').sync(hashes);
  return sha256tree.root();
};

module.exports = Mine;
