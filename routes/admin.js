const express = require('express');
const router = express.Router();
const moment = require('moment');
const utils = require('../helpers/utlis');

moment.locale('id');

module.exports = pool => {
  router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM kader ORDER BY namalengkap', (err, result) => {
      if (!err) {
        console.log(req.session.user)
        res.render('admin/list', { user: req.session.user, data: result.rows });
      } else {
        console.error(JSON.parse(err, undefined, 2))
        res.send(err)
      }
    })
  });

  router.get('/detail/:id', (req, res) => {
    pool.query('SELECT * FROM kader WHERE kaderid=$1', [parseInt(req.params.id)], (err, result) => {
      if (!err) {
        res.render('admin/details', { data: result.rows, moment })
      } else {
        console.error(JSON.parse(err, undefined, 2))
        res.send(err)
      }
    })
  })

  router.get('/add', (req, res) => {
    res.render('admin/add')
  })

  router.post('/add', (req, res) => {
    const { nim, namalengkap, jurusan, tempatlahir, tanggallahir, alamat, nohp, email, divisi, hobby, pengalamanorganisasi, pengkaderan, sertifikat } = req.body;
    let sql = `INSERT INTO kader (nim, namalengkap, jurusan, tempatlahir, tanggallahir, alamat, nohp, email, divisi, hobby, pengalamanorganisasi, pengkaderan, sertifikat, datecreated, dateupdated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())`;
    let sqlUsers = `INSERT INTO aksesuser (nim, password, datecreated, dateupdated) VALUES ($1, 'nopassword', NOW(), NOW())`;

    pool.query(sql, [nim, namalengkap, jurusan, tempatlahir, tanggallahir, alamat, nohp, email, divisi, hobby, pengalamanorganisasi, pengkaderan, sertifikat], err => {
      if (!err) {
        console.log('add new data success')
        pool.query(sqlUsers, [nim], err => {
          if (!err) {
            console.log('add new data to akesuser success');
            res.redirect('/admin');
          } else {
            console.error(err)
            res.send(err)
          }
        })
      } else {
        console.error(err)
        res.send(err)
      }
    })
  })

  router.get('/edit/:id', (req, res) => {
    pool.query('SELECT * FROM kader WHERE kaderid=$1', [parseInt(req.params.id)], (err, result) => {
      if (!err) {
        let data = result.rows[0];
        res.render('admin/edit', { data, moment })
      } else {
        console.error(err)
        res.send(err)
      }
    })
  });

  router.post('/edit/:id', (req, res) => {
    const { nim, namalengkap, jurusan, tempatlahir, tanggallahir, alamat, nohp, email, divisi, hobby, pengalamanorganisasi, pengkaderan, sertifikat } = req.body;
    let sql = `UPDATE kader SET nim=$1, namalengkap=$2, jurusan=$3, tempatlahir=$4, tanggallahir=$5, alamat=$6, nohp=$7, email=$8, divisi=$9, hobby=$10, pengalamanorganisasi=$11, pengkaderan=$12, sertifikat=$13 WHERE kaderid=$14`;

    pool.query(sql, [nim, namalengkap, jurusan, tempatlahir, tanggallahir, alamat, nohp, email, divisi, hobby, pengalamanorganisasi, pengkaderan, sertifikat, parseInt(req.params.id)], (err) => {
      if (!err) {
        console.log('update data berhasil')
        res.redirect('/admin')
      } else {
        console.error(err)
        res.send(err)
      }
    })
  })

  router.get('/delete/:id', (req, res) => {
    pool.query(`DELETE FROM kader WHERE kaderid=$1`, [parseInt(req.params.id)], err => {
      if (!err) {
        console.log('delete success')
        res.redirect('/admin')
      } else {
        console.error(err)
        res.send(err)
      }
    })
  })

  return router;
};
