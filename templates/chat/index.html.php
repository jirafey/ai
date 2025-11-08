<?php

/** @var \App\Model\Chat[] $chats */
/** @var \App\Service\Router $router */

$title = 'Chat List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Chats List</h1>

    <a href="<?= $router->generatePath('chat-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($chats as $chat): ?>
            <li>
                <h3><?= htmlspecialchars($chat->getNick()) ?>(Likes: <?= $chat->getLikes()?>)</h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('chat-show', ['id' => $chat->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('chat-edit', ['id' => $chat->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
