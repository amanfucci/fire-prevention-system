import threading
import time
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
# --- Settings
TIME_MOLT = 1 / 1000  # Speed up simulation, 1/TIME_MOLT faster
FRAME_SIZE = 240 * 8  # bit
BANDWIDTH = 5000  # bps
TOA = 0.384 * TIME_MOLT  # seconds
MIN_STAZIONI = 2
MAX_STAZIONI = 7
RANGE_STAZIONI_N = MAX_STAZIONI - MIN_STAZIONI + 1
ITERATIONS = 5
TASK_TIME = 600 * TIME_MOLT  # seconds
# ---


class SharedList(object):

    def __init__(self):
        self.lock = threading.Lock()
        self.list = []

    def add_frame(self, frame):
        self.lock.acquire()
        try:
            self.list.append(frame)
        finally:
            self.lock.release()


def task(my_s_list, name):  # Send frames task
    # First frame is sent after a random time
    time.sleep(np.random.uniform(10 * TIME_MOLT, 20 * TIME_MOLT))

    end = time.time() + TASK_TIME
    while time.time() < end:
        now = time.time()
        # print("\n%s: Start-%s End-%s\n" % (name, now, now + toa), end='')
        my_s_list.add_frame([now, now + TOA])
        time.sleep(TOA)
        time.sleep(TOA * 99 * TIME_MOLT)  # Follow duty cycle 1%


if __name__ == '__main__':
    plt_var = [{"x": {"val": [], "name": ''}, "y": {"val": [], "name": ''}} for x in range(3)]
    plt_first_round = True
    plt_x = [[] for x in range(10)]
    name_x = []
    plt_y = [[] for x in range(10)]
    name_y = []

    # Show simulation status
    print("\r", "0.00%, -",
          "%.2f" % (TASK_TIME * ITERATIONS * RANGE_STAZIONI_N),
          " [", "".join(['-' for z in range(ITERATIONS)]), "]",
          end='', sep='')

    for i in range(RANGE_STAZIONI_N):

        n_stazioni = i + MIN_STAZIONI
        stats = {'success_rate': [], 'sim_time': [], 'exec_time': [],
                 'avg_frames_toa': [], 'avg_bps': [], 'avg_th': []}

        for j in range(ITERATIONS):
            s_list = SharedList()
            stazioni = []
            for k in range(n_stazioni):
                # Start new thread
                stazioni.append(threading.Thread(target=task, args=(s_list, "Stazione-" + str(j))))
                stazioni[-1].start()

            for thread in stazioni:
                thread.join()

            result = []
            for x in s_list.list:
                bad = False
                temp = s_list.list.copy()
                temp.remove(x)
                for y in temp:
                    #
                    #  [0]       x[1]               x[0]       x[1]        x[0]       x[1]
                    #   |---.------|                  |------.---|           |----------|
                    #       .                                .               .          .
                    #       .                                .               .          .
                    #       |----------|          |----------|               |----------|
                    #     y[0]       y[1]       y[0]       y[1]            y[0]       y[1]
                    #
                    if (x[0] < y[0] < x[1]) or (x[0] < y[1] < x[1]) or x[0] == y[0]:
                        bad = True  # A collision happened
                        break
                result.append(bad)

            # Calculate statistics
            n_frames = len(s_list.list)
            success_rate = result.count(False) / n_frames
            exec_time = s_list.list[-1][1] - s_list.list[0][0]  # Effective execution time
            sim_time = exec_time / TIME_MOLT  # Simulated time (takes into account TIME_MOLT)
            avg_frames_toa = (n_frames / exec_time) * TOA
            avg_bps = result.count(False) / sim_time * FRAME_SIZE
            avg_th = avg_bps / BANDWIDTH

            # Add iteration
            stats['success_rate'].append(success_rate)
            stats['exec_time'].append(exec_time)
            stats['sim_time'].append(sim_time)
            stats['avg_frames_toa'].append(avg_frames_toa)
            stats['avg_bps'].append(avg_bps)
            stats['avg_th'].append(avg_th)

            # Show simulation status
            print("\r", "%.2f" % ((i+((j+1)/ITERATIONS)) / RANGE_STAZIONI_N * 100), "%, -",
                  "%.2f" % (TASK_TIME * ITERATIONS * (RANGE_STAZIONI_N - (i+(j+1)/ITERATIONS))),
                  " [", "".join(['=' for z in range(j+1)]),
                  "".join(['-' for z in range(ITERATIONS-1-j)]), "]",
                  end='', sep='')

        # Show stats
        print("\nExec. Time: ", "%.3f" % np.sum(stats['exec_time']),
              "\nStazioni: ", n_stazioni,
              "\nAvg. Frames in ToA: ", "%.3f" % np.average(stats['avg_frames_toa']),
              "\nAvg. bps: ", "%.3f" % np.average(stats['avg_bps']),
              "\nSuccess Rate [%]: ", "%.3f\n" % np.average(stats['success_rate']))

        # Add to Graph
        if plt_first_round:  # Labels
            plt_var[0]['x']['name'] = 'n_stazioni'
            plt_var[0]['y']['name'] = 'success_rate'
            plt_var[1]['x']['name'] = 'avg_frames_toa'
            plt_var[1]['y']['name'] = 'avg_th'
            plt_var[2]['x']['name'] = 'n_stazioni'
            plt_var[2]['y']['name'] = 'avg_frames_toa'

        plt_var[0]['x']['val'].append(n_stazioni)  # Values
        plt_var[0]['y']['val'].append(np.average(stats['success_rate']))
        plt_var[1]['x']['val'].append(np.average(stats['avg_frames_toa']))
        plt_var[1]['y']['val'].append(np.average(stats['avg_th']))
        plt_var[2]['x']['val'].append(n_stazioni)
        plt_var[2]['y']['val'].append(np.average(stats['avg_frames_toa']))

    # Plot
    fig = plt.figure(figsize=(160, 90))
    for i in range(len(plt_var)):
        plt.subplot(2, 2, i+1)
        plt.grid(True)
        plt.scatter(x=plt_var[i]['x']['val'], y=plt_var[i]['y']['val'], marker='o', c='blue', s=20)
        plt.xlabel(plt_var[i]['x']['name'])
        plt.ylabel(plt_var[i]['y']['name'])
    plt.show()
