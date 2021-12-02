// projects
export const projectsCategory = (req, res, next) => {
  const {
    params: { category },
  } = req;

  if (category == "recruitments") {
    req.body.category = "projects/recruitments";
    req.body.model = "Recruitment";
  } else if (category == "orders") {
    req.body.category = "projects/orders";
    req.body.model = "Order";
  } else {
    return res.redirect("/");
  }

  return next();
};

// api
export const viewsCategory = (req, res, next) => {
  const {
    params: { category },
  } = req;

  if (category == "recruitments") {
    req.body.model = "Recruitment";
  } else if (category == "orders") {
    req.body.model = "Order";
  } else if (category == "communities") {
    req.body.model = "Community";
  } else {
    return res.redirect("/");
  }

  return next();
};
