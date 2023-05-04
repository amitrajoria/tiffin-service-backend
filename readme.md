# APIs for handling backend services

/auth/signup    POST
    request = {name, email, password}
    response = {msg}

/auth/login     POST
    request = {email, password}
    response = {msg, token}

/profile        GET
    request = {login token}
    response = {user}

/profile/update PATCH
    request = {login token, payload}
    response = {updated user data}

/pg             GET
    request = {login token}
    response = {pg}

/pg/add         POST
    request = {login token, payload}
    response = {msg}

/pg/registered      GET
    request = {login token}
    response = {pg : which are registered on login vender}

/venders        GET
    request = {login token}
    response = {venders}

/venders/add    POST
    request = {login token admin, payload}
    response = {msg}

/cart/:venderId     GET
    request = {login token}
    response = {cart}

/cart/add           POST
    request = {login token, payload}
    response = {msg}

/cart/delete/:cart_id   DELETE
    request = {login token}
    response = {msg}

/orders?from-to date        GET
    request = {login token}
    response = {orders}

/orders/add     POST
    request = {login token, payload}
    response = {msg}

/orders/analytics?from-to date      GET 
    request = {login token}
    response = {analytics}

/tiffins/:vender_id     GET
    request = {login token}
    response = {tiffins}

/tiffins/add    POST
    request = {login token vender, payload}
    response = {msg}

/tiffins/update    PATCH
    request = {login token vender, payload(id, status)}
    response = {tiffins}

/customers/     GET
    request = {login token}
    response = {customers : which are registered with current vender}