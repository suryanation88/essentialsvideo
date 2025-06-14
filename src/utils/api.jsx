const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const loadImage = (image_path) => {
  return REACT_APP_API_URL + "/public" + image_path;
};

export const getData = async (url) => {
  return fetch(REACT_APP_API_URL + url)
    .then((response) => (response.status >= 200 && response.status <= 299 && response.status !== 204 ? response.json() : response))
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

export const sendData = async (url, data) => {
  const options = {
    method: "POST",
  };

  if (data instanceof FormData) {
    options.body = data;
  } else {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(data);
  }

  return fetch(REACT_APP_API_URL + url, options)
    .then((response) => {
      return response.status === 401 ? { isExpiredJWT: true } : response.status >= 200 && response.status <= 299 && response.status !== 204 ? response.json() : response;
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error("Error (sendData):", err);
      throw err;
    });
};

export const updateData = async (url, data) => {
  const options = {
    method: "POST",
  };

  if (data instanceof FormData) {
    options.body = data;
  } else {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(data);
  }

  return fetch(REACT_APP_API_URL + url, options)
    .then((response) => {
      return response.status === 401 ? { isExpiredJWT: true } : response.status >= 200 && response.status <= 299 && response.status !== 204 ? response.json() : response;
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error("Error (updateData):", err);
      throw err;
    });
};

export const deleteData = async (url) => {
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status === 401) {
        return { isExpiredJWT: true };
      }
      if (response.status === 204) {
        return { status: 204 };
      }

      const isSuccess = response.status >= 200 && response.status <= 299;
      if (isSuccess) {
        return response
          .json()
          .then((data) => data)
          .catch(() => ({ status: response.status }));
      }

      return response;
    })
    .then((data) => data)
    .catch((err) => {
      throw err;
    });
};
