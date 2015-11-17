# helical-express-sequelize-jade

A [helical](https://github.com/gimenete/helical) generator to create a structure of a Node application using express, sequelize and jade.

## Usage

Install helical

```
npm install helical -g
```

Download this project, copy the `model.json` and edit it to fit your needs.

Then run helical

```
npm install helical -g
helical \
  --model model.json \
  --generator helical-express-sequelize-jade \
  --output output \
  --auth twitter
```
