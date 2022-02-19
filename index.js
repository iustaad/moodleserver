const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const devs = [
  { id: 1, name: "Minhaj" },
  { id: 2, name: "Muneeb" },
  { id: 3, name: "Ahmed" },
];

app.get("/api/devs", (req, res) => {
  res.send(devs);
});

app.post("/api/devs", (req, res) => {
  const { error } = validateDev(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const dev = {
    id: devs.length + 1,
    name: req.body.name,
  };
  devs.push(dev);
  res.send(dev);
});

app.put("/api/devs/:id", (req, res) => {
  const dev = devs.find((c) => c.id === parseInt(req.params.id));
  if (!dev) res.status(404).send("The dev with the given ID was not found");

  const { error } = validateDev(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  dev.name = req.body.name;
  res.send(dev);
});

app.delete("/api/devs/:id", (req, res) => {
  const dev = devs.find((c) => c.id === parseInt(req.params.id));
  if (!dev) {
    res.status(404).send("The dev with the given ID was not found");
    return;
  }

  const index = devs.indexOf(dev);
  devs.splice(index, 1);

  res.send(dev);
});

function validateDev(dev) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(dev);
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
