/**
 * 1、首个成功的Promise
 *
 * 从一组Promise里面得到第一个“成功的”结果，同时获得了并发执行的速度和容灾的能力。
 *
 * Promise.race不满足需求，因为如果有一个Promise率先reject，结果Promise也会立即reject；
 * Promise.all也不满足需求，因为它会等待所有Promise，并且要求所有Promise都成功resolve。
 *
 * 把resolve的Promise反转成reject，把reject的Promise反转成resolve，然后用Promise.all合并起来。
 * 这样的话，只要有一个原始Promise成功resolve，就会造成Promise.all立刻被reject，实现提前退出！太巧妙了！

 * 这个方法适合的场景：

 *  有多条路可以走，其中任意一条路走通即可，其中有一些路失败也没关系
 *  为了加速得到结果，并发地走多条路，避免瀑布式尝试
 */

function firstSuccess(promises){
  return Promise.all(promises.map(p => {
    // If a request fails, count that as a resolution so it will keep
    // waiting for other possible successes. If a request succeeds,
    // treat it as a rejection so Promise.all immediately bails out.
    return p.then(
      val => Promise.reject(val),
      err => Promise.resolve(err)
    );
  })).then(
    // If '.all' resolved, we've just got an array of errors.
    errors => Promise.reject(errors),
    // If '.all' rejected, we've got the result we wanted.
    val => Promise.resolve(val)
  );
}