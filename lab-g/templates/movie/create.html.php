<?php

/** @var \App\Model\Movie $movie */
/** @var \App\Service\Router $router */

$title = 'Add Movie';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Add Movie</h1>
    <form action="<?= $router->generatePath('movie-create') ?>" method="movie" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="movie-create">
    </form>

    <a href="<?= $router->generatePath('movie-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
