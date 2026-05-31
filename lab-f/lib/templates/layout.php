<?php $formats = array('CSV', 'JSON', 'YAML'); ?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter danych</title>
</head>
<body>
<h1>Konwerter danych</h1>

<form method="POST">
    <div>
        <label for="input_data">Dane wejściowe:</label><br>
        <textarea id="input_data" name="input_data" rows="10" cols="60"><?php echo htmlspecialchars($inputData); ?></textarea>
    </div>

    <div>
        <label for="in_format">Format wejściowy:</label>
        <select id="in_format" name="in_format">
            <?php foreach ($formats as $fmt): ?>
                <option value="<?php echo $fmt; ?>" <?php echo $inFormat === $fmt ? 'selected' : ''; ?>>
                    <?php echo $fmt; ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div>
        <label for="out_format">Format wyjściowy:</label>
        <select id="out_format" name="out_format">
            <?php foreach ($formats as $fmt): ?>
                <option value="<?php echo $fmt; ?>"<?php echo $outFormat === $fmt ? ' selected' : ''; ?>>
                    <?php echo $fmt; ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <button type="submit">Konwertuj</button>
</form>

<?php if ($output !== ''): ?>
    <h2>Wynik:</h2>
    <pre><?php echo htmlspecialchars($output); ?></pre>
<?php endif; ?>
</body>
</html>