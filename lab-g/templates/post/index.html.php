<?php

/** @var \App\Model\Post[] $posts */
/** @var \App\Service\Router $router */
/** @var \App\Model\Movie[] $movies */
$title = 'Post List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Posts List</h1>

    <a href="<?= $router->generatePath('post-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($posts as $post): ?>
            <li><h3><?= $post->getSubject() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('post-show', ['id' => $post->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('post-edit', ['id' => $post->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>
    <h1>Movies List</h1>

    <a href="<?= $router->generatePath('movie-create') ?>">Create new movie</a>

    <ul class="index-list movies-list">
        <?php foreach ($movies as $movie): ?>
            <li>
                <h3><?= htmlspecialchars($movie->getTitle(), ENT_QUOTES) ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('movie-show', ['id' => $movie->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('movie-edit', ['id' => $movie->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
