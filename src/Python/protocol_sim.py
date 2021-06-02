import threading
import time
import numpy as np
import matplotlib.pyplot as plt
# --- Settings
TIME_MOLT = 1 / 1000  # Speed up simulation, 1/TIME_MOLT faster
FRAME_SIZE = 240 * 8  # bit
BANDWIDTH = 5000  # bps
TOA = 0.384 * TIME_MOLT  # seconds
MIN_NODES = 2
MAX_NODES = 7
RANGE_NODES = MAX_NODES - MIN_NODES + 1
ITERATIONS = 10
TASK_TIME = 600 * TIME_MOLT  # seconds
N_GRAPHS = 4
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
        time.sleep(TOA * 99)  # Follow duty cycle 1%


if __name__ == '__main__':
    plt_var = [{"x": {"val": [], "name": ''}, "y": {"val": [], "name": ''}} for x in range(N_GRAPHS)]
    plt_first_round = True

    # Show simulation status
    print("\r", "0.00%, -",
          "%.2f" % (TASK_TIME * ITERATIONS * RANGE_NODES),
          " [", "".join(['-' for z in range(ITERATIONS)]), "]",
          end='', sep='')

    for i in range(RANGE_NODES):

        n_nodes = i + MIN_NODES
        stats = {'success_rate': [], 'sim_time': [], 'exec_time': [],
                 'avg_frames_toa': [], 'avg_bps': [], 'avg_th': []}
        program_start = time.time()

        for j in range(ITERATIONS):
            s_list = SharedList()
            nodes = []
            for k in range(n_nodes):
                # Start new thread
                nodes.append(threading.Thread(target=task, args=(s_list, "Node-" + str(k))))
                nodes[-1].start()

            for thread in nodes:
                thread.join()

            result = []
            for x in s_list.list:
                bad = False
                temp = s_list.list.copy()
                temp.remove(x)
                for y in temp:
                    #
                    # x[0]       x[1]               x[0]       x[1]        x[0]       x[1]
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
            print("\r", "%.2f" % ((i+((j+1)/ITERATIONS)) / RANGE_NODES * 100), "%, -",
                  "%.2f" % (TASK_TIME * ITERATIONS * (RANGE_NODES - (i + (j + 1) / ITERATIONS))),
                  " [", "".join(['=' for z in range(j+1)]),
                  "".join(['-' for z in range(ITERATIONS-1-j)]), "]",
                  end='', sep='')

        program_time = time.time() - program_start
        overhead_ratio = program_time / np.sum(stats['exec_time'])
        # Show stats
        print("\nn_nodes: ", n_nodes,
              "\nexec_time: ", "%.3f" % np.sum(stats['exec_time']),
              "\noverhead_ratio: " "%.3f" % overhead_ratio,
              "\navg_frames_toa: ", "%.3f" % np.average(stats['avg_frames_toa']),
              "\navg_bps: ", "%.3f" % np.average(stats['avg_bps']),
              "\nsuccess_rate: ", "%.3f\n" % np.average(stats['success_rate']), )

        # Add to Graph
        if plt_first_round:  # Labels
            plt_var[0]['x']['name'] = 'n_nodes'
            plt_var[0]['y']['name'] = 'success_rate'
            plt_var[1]['x']['name'] = 'avg_frames_toa'
            plt_var[1]['y']['name'] = 'avg_th'
            plt_var[2]['x']['name'] = 'n_nodes'
            plt_var[2]['y']['name'] = 'avg_frames_toa'
            plt_var[3]['x']['name'] = 'n_nodes'
            plt_var[3]['y']['name'] = 'avg_bps'

        plt_var[0]['x']['val'].append(n_nodes)  # Values
        plt_var[0]['y']['val'].append(np.average(stats['success_rate']))
        plt_var[1]['x']['val'].append(np.average(stats['avg_frames_toa']))
        plt_var[1]['y']['val'].append(np.average(stats['avg_th']))
        plt_var[2]['x']['val'].append(n_nodes)
        plt_var[2]['y']['val'].append(np.average(stats['avg_frames_toa']))
        plt_var[3]['x']['val'].append(n_nodes)
        plt_var[3]['y']['val'].append(np.average(stats['avg_bps']))

    # Plot

    fig = plt.figure(figsize=(160, 90))

    for i in range(len(plt_var)):
        plt.subplot(2, 2, i+1)
        plt.title('TIME_MOLT: ' + str(TIME_MOLT) +
                  ', ITERATIONS: ' + str(ITERATIONS) +
                  ', TASK_TIME: ' + str(TASK_TIME/TIME_MOLT))

        plt.grid(True)
        plt.scatter(x=plt_var[i]['x']['val'], y=plt_var[i]['y']['val'], marker='o', c='blue', s=20)
        plt.xlabel(plt_var[i]['x']['name'])
        plt.ylabel(plt_var[i]['y']['name'])
    plt.show()
