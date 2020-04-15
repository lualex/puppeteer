### class: Worker

The Worker class represents a [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

#### worker.evaluate(pageFunction[, ...args])
- `pageFunction` <[function]|[string]> Function to be evaluated in the worker context
- returns: <[Promise]<[boolean]>>  returns `true` if the revision could be downloaded from the host.

#### worker.otherMethod()
- returns: <[Promise]<[boolean]>>  returns `true` if the revision could be downloaded from the host.

#### worker.somethingElse(x)
- `x` <[string]> something
- returns: <[Promise]<[string]>>  returns some string in a promise
