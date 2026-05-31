<?php
/** @var $movie ?\App\Model\Movie */
?>
<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="movie[title]" value="<?= $movie ? $movie->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="director">Director</label>
    <input type="text" id="director" name="movie[director]" value="<?= $movie ? $movie->getDirector() : ''?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>