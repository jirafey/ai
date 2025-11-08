<?php

/** @var \App\Model\Chat $chat */
/** @var \App\Service\Router $router */

$title = "Edit Chat {$chat->getNick()} ({$chat->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('chat-edit') ?>" method="POST" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="chat-edit">
        <input type="hidden" name="id" value="<?= $chat->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('chat-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('chat-delete') ?>" method="POST">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="chat-delete">
                <input type="hidden" name="id" value="<?= $chat->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
