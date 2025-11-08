<?php

/** @var \App\Model\Post chat */
/** @var \App\Service\Router $router */

$title = "{$chat->getNick()} ({$chat->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $chat->getNick() ?></h1>
    <article>
        <?= $chat->getMessage();?>
    </article>
    <p>Likes: <?= $chat->getLikes() ?></p>
    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('chat-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('chat-edit', ['id'=> $chat->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
