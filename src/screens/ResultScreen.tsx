React.useEffect(() => {
    const saveRecord = async () => {
      try {
        const tg = (window as any)?.Telegram?.WebApp;
        const tgUser = tg?.initDataUnsafe?.user;

        // Если данных пользователя Telegram нет (десктоп/браузер), генерируем локальный ID
        let localId = localStorage.getItem('quiz_user_id');
        if (!localId) {
          localId = String(Math.floor(100000 + Math.random() * 900000));
          localStorage.setItem('quiz_user_id', localId);
        }

        const userId = tgUser?.id ? Number(tgUser.id) : Number(localId);
        const firstName = tgUser?.first_name || 'Участник';
        const username = tgUser?.username || '';

        if (score > 0) {
          await supabase.from('leaderboard').upsert(
            {
              user_id: userId,
              username: username,
              first_name: firstName,
              score: score,
              accuracy: accuracyPercentage,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        }
      } catch (e) {
        console.error('Ошибка сохранения в таблицу лидеров:', e);
      }
    };

    saveRecord();
  }, [score, accuracyPercentage]);
