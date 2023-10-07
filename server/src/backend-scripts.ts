/** this file will have the background script for updating prices */

// replace book with instrument
// // delete a book from the database
// app.delete("/delete/:bookId", (req, res) => {
//     const bookId = req.params.bookId;
//     const DeleteQuery = "DELETE FROM books_reviews WHERE id = ?";
//     db.query(DeleteQuery, bookId, (err, result) => {
//       if (err) console.log(err);
//     })
//   })

/** replace with updating instrument */
// // update a book review
// app.put("/update/:bookId", (req, res) => {
//     const bookReview = req.body.reviewUpdate;
//     const bookId = req.params.bookId;
//     const UpdateQuery = "UPDATE books_reviews SET book_review = ? WHERE id = ?";
//     db.query(UpdateQuery, [bookReview, bookId], (err, result) => {
//       if (err) console.log(err)
//     })
//   })